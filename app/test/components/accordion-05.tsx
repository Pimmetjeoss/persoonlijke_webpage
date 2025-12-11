import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

export interface FAQItem {
  id: string;
  title: string;
  content: string;
}

interface Accordion05Props {
  items: FAQItem[];
  defaultOpen?: string;
}

export function Accordion05({ items, defaultOpen }: Accordion05Props) {
  return (
    <div className="w-full rounded-xl p-6 bg-white">
      <Accordion type="single" defaultValue={defaultOpen} collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="border-b border-[hsl(144.9_80.4%_10%)]/10">
            <AccordionTrigger className="text-left pl-6 md:pl-14 overflow-hidden duration-200 hover:no-underline cursor-pointer -space-y-6 data-[state=open]:space-y-0 [&>svg]:hidden [color:hsl(144.9_80.4%_10%)]">
              <div className="flex flex-1 items-start gap-4">
                <p className="text-xs">{item.id}</p>
                <h1 className="uppercase relative text-left text-3xl md:text-5xl">
                  {item.title}
                </h1>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pb-6 pl-6 md:px-20 text-gray-600">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
