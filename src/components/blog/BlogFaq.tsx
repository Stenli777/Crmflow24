import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SectionHeader } from "@/components/SectionHeader";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type BlogFaqProps = {
  items: FaqItem[];
};

export function BlogFaq({ items }: BlogFaqProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <SectionHeader title="Вопросы по теме" />
      {items.map((item) => (
        <Accordion
          key={item.id}
          disableGutters
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "12px !important",
            mb: 1,
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
              {item.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
