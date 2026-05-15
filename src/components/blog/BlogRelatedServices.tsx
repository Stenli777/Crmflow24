import Link from "next/link";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { SectionHeader } from "@/components/SectionHeader";

type ServiceItem = {
  id: string;
  title: string;
  href: string;
};

type BlogRelatedServicesProps = {
  services: ServiceItem[];
};

export function BlogRelatedServices({ services }: BlogRelatedServicesProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <>
      <SectionHeader title="Связанные услуги" />
      <List disablePadding sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
        {services.map((svc) => (
          <ListItem key={svc.id} disablePadding divider>
            <Link href={svc.href} style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemButton>
                <ListItemText
                  primary={svc.title}
                  slotProps={{ primary: { sx: { fontWeight: 600 } } }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </>
  );
}
