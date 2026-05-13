"use client";

import { Box, Typography } from "@mui/material";
import { legalConfig } from "@/config/legal";

export function CompanyRequisitesFull() {
  return (
    <Box component="section" aria-labelledby="requisites-heading">
      <Typography id="requisites-heading" variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
        Реквизиты
      </Typography>
      <Typography component="div" variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
        {legalConfig.operatorName}
        {"\n"}
        ИНН {legalConfig.inn}
        {"\n"}
        КПП {legalConfig.kpp}
        {"\n"}
        ОГРН {legalConfig.ogrn}
        {"\n"}
        Юр. адрес: {legalConfig.legalAddress}
      </Typography>
    </Box>
  );
}
