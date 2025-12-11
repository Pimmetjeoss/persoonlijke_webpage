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
    <div className="w-full">
      <Accordion type="single" defaultValue={defaultOpen} collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="border-b border-[hsl(144.9_80.4%_10%)]/10">
            <AccordionTrigger className="text-left overflow-hidden duration-200 hover:no-underline cursor-pointer -space-y-6 data-[state=open]:space-y-0 [&>svg]:hidden [color:hsl(144.9_80.4%_10%)]">
              <div className="flex flex-1 items-start gap-4">
                <p className="text-xs">{item.id}</p>
                <h1 className="uppercase relative text-left text-3xl md:text-5xl font-bold">
                  {item.title}
                </h1>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pb-6 text-lg md:text-xl text-gray-600">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
