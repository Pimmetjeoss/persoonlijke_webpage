#!/usr/bin/env python3
"""Export GA4 organic data via the SEO Hermes profile's analytics MCP server.

This is a small bridge between the dashboard's `SEO_GA4_COMMAND` adapter and
an existing MCP-based GA4 setup. It prints one normalized JSON object to stdout.
"""
import argparse
import asyncio
import json
import os
import sys
from typing import Any

try:
    from mcp import ClientSession, StdioServerParameters
    from mcp.client.stdio import stdio_client
except Exception as exc:  # pragma: no cover - environment dependent
    print(json.dumps({"error": f"Python MCP SDK is not available: {exc}"}), file=sys.stdout)
    raise SystemExit(0)

DEFAULT_MCP_COMMAND = "/home/pimmetje/.hermes/profiles/seo/home/.local/bin/analytics-mcp"
DEFAULT_PROJECT_ID = "code-lieshout-seo"
DEFAULT_CLOUDSDK_CONFIG = "/home/pimmetje/.hermes/profiles/seo/.config/gcloud"
DEFAULT_ADC = "/home/pimmetje/.hermes/profiles/seo/.config/gcloud/application_default_credentials.json"


def num(value: Any) -> float:
    try:
        return float(value)
    except Exception:
        return 0.0


def maybe_int(value: float) -> int | float:
    return int(value) if float(value).is_integer() else value


def date_text(raw: str) -> str:
    if len(raw) == 8 and raw.isdigit():
        return f"{raw[:4]}-{raw[4:6]}-{raw[6:8]}"
    return raw


def rows_to_dicts(report: dict[str, Any]) -> list[dict[str, Any]]:
    dimensions = [item.get("name", "dimension") for item in report.get("dimension_headers", [])]
    metrics = [item.get("name", "metric") for item in report.get("metric_headers", [])]
    rows = []
    for row in report.get("rows", []) or []:
        out: dict[str, Any] = {}
        for name, value in zip(dimensions, row.get("dimension_values", []) or []):
            out[name] = value.get("value", "")
        for name, value in zip(metrics, row.get("metric_values", []) or []):
            out[name] = maybe_int(num(value.get("value", 0)))
        rows.append(out)
    return rows


def organic_filter() -> dict[str, Any]:
    return {
        "filter": {
            "field_name": "sessionDefaultChannelGroup",
            "string_filter": {"match_type": 1, "value": "Organic Search", "case_sensitive": False},
        }
    }


async def call_report(session: ClientSession, property_id: str, days: int, dimensions: list[str], metrics: list[str], limit: int, order_bys=None) -> dict[str, Any]:
    result = await session.call_tool(
        "run_report",
        {
            "property_id": property_id,
            "date_ranges": [{"start_date": f"{days}daysAgo", "end_date": "yesterday", "name": f"last{days}"}],
            "dimensions": dimensions,
            "metrics": metrics,
            "dimension_filter": organic_filter(),
            "order_bys": order_bys or [],
            "limit": limit,
        },
    )
    if getattr(result, "isError", False):
        text = result.content[0].text if result.content else "GA4 MCP tool returned an error"
        raise RuntimeError(text)
    text = result.content[0].text if result.content else "{}"
    return json.loads(text)


async def export(args: argparse.Namespace) -> dict[str, Any]:
    env = {
        **os.environ,
        "GOOGLE_PROJECT_ID": os.getenv("SEO_GA4_GOOGLE_PROJECT_ID", DEFAULT_PROJECT_ID),
        "CLOUDSDK_CONFIG": os.getenv("SEO_GA4_CLOUDSDK_CONFIG", DEFAULT_CLOUDSDK_CONFIG),
        "GOOGLE_APPLICATION_CREDENTIALS": os.getenv("SEO_GA4_APPLICATION_CREDENTIALS", DEFAULT_ADC),
    }
    command = os.getenv("SEO_GA4_MCP_COMMAND", DEFAULT_MCP_COMMAND)
    params = StdioServerParameters(command=command, args=[], env=env)
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            daily_report = await call_report(
                session,
                args.property,
                args.days,
                ["date"],
                ["sessions", "totalUsers", "screenPageViews", "conversions", "engagementRate"],
                min(args.limit, 366),
                [{"dimension": {"dimension_name": "date"}, "desc": False}],
            )
            landing_report = await call_report(
                session,
                args.property,
                args.days,
                ["landingPagePlusQueryString"],
                ["sessions", "totalUsers", "conversions", "engagementRate"],
                args.limit,
                [{"metric": {"metric_name": "sessions"}, "desc": True}],
            )
            events_report = await call_report(
                session,
                args.property,
                args.days,
                ["eventName"],
                ["eventCount", "conversions"],
                min(args.limit, 50),
                [{"metric": {"metric_name": "eventCount"}, "desc": True}],
            )

    daily_data = [
        {
            "date": date_text(str(row.get("date", ""))),
            "sessions": row.get("sessions", 0),
            "users": row.get("totalUsers", 0),
            "pageviews": row.get("screenPageViews", 0),
            "conversions": row.get("conversions", 0),
            "engagement_rate": round(num(row.get("engagementRate", 0)) * 100, 2),
        }
        for row in rows_to_dicts(daily_report)
    ]
    top_pages = [
        {
            "landing_page": row.get("landingPagePlusQueryString") or "/",
            "sessions": row.get("sessions", 0),
            "users": row.get("totalUsers", 0),
            "conversions": row.get("conversions", 0),
            "engagement_rate": round(num(row.get("engagementRate", 0)) * 100, 2),
        }
        for row in rows_to_dicts(landing_report)
    ]
    events = [
        {
            "eventName": row.get("eventName") or "event",
            "eventCount": row.get("eventCount", 0),
            "conversions": row.get("conversions", 0),
        }
        for row in rows_to_dicts(events_report)
    ]
    total_sessions = sum(num(row.get("sessions", 0)) for row in daily_data)
    total_users = sum(num(row.get("users", 0)) for row in daily_data)
    total_pageviews = sum(num(row.get("pageviews", 0)) for row in daily_data)
    total_conversions = sum(num(row.get("conversions", 0)) for row in daily_data)
    avg_engagement = round(sum(num(row.get("engagement_rate", 0)) for row in daily_data) / len(daily_data), 2) if daily_data else 0
    return {
        "property": args.property,
        "channel": "Organic Search",
        "days": args.days,
        "daily_data": daily_data,
        "top_pages": top_pages,
        "events": events,
        "totals": {
            "sessions": maybe_int(total_sessions),
            "users": maybe_int(total_users),
            "pageviews": maybe_int(total_pageviews),
            "conversions": maybe_int(total_conversions),
            "engagementRate": avg_engagement,
        },
        "metadata": {"transport": "mcp", "server": "analytics-mcp"},
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--property", default=os.getenv("SEO_GA4_PROPERTY", "526910157"))
    parser.add_argument("--days", type=int, default=int(os.getenv("SEO_DAYS", "180")))
    parser.add_argument("--limit", type=int, default=int(os.getenv("SEO_LIMIT", "25")))
    parser.add_argument("--json", action="store_true", help="Accepted for SEO_GA4_COMMAND compatibility")
    args = parser.parse_args()
    try:
        payload = asyncio.run(export(args))
    except Exception as exc:
        payload = {"error": str(exc)}
    print(json.dumps(payload, ensure_ascii=False))


if __name__ == "__main__":
    main()
