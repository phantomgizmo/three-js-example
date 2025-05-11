import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

const SimpleAccordion = ({
  children,
  title,
  className
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
}) => {
  return (
    <Accordion type="single" collapsible className={className}>
      <AccordionItem className="text-white" value="item-1">
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SimpleAccordion;
