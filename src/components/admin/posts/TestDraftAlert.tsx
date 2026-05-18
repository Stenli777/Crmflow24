import { Alert } from "@mui/material";

type TestDraftAlertProps = {
  title: string;
};

export function TestDraftAlert({ title }: TestDraftAlertProps) {
  return (
    <Alert severity="warning" sx={{ mb: 2 }}>
      <strong>Тестовый черновик.</strong> Заголовок «{title}» похож на smoke/production
      проверку. После проверки удалите пост кнопкой «Удалить» — связанная запись Scrap
      удалится каскадом.
    </Alert>
  );
}
