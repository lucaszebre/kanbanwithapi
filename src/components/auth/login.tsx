import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { SchemaLogin } from "@/types/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Icons } from "../common/icons";

export const Login = () => {
  const { t } = useTranslation("auth");
  const form = useForm<z.infer<typeof SchemaLogin>>({
    resolver: zodResolver(SchemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { signin, isLoading } = useAuth();

  async function onSubmit(values: z.infer<typeof SchemaLogin>) {
    signin(values.email, values.password);
  }

  return (
    <Card className="p-4">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl ">{t("login.title")}</CardTitle>
        <CardDescription>{t("login.description")}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-3 content-start items-start flex-col space-y-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-col items-start content-start w-full">
                <FormLabel className="text-start w-full">
                  {t("login.email")}
                </FormLabel>
                <FormControl>
                  <Input placeholder={t("login.emailPlaceholder")} {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-start items-start w-full">
                  {t("login.password")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("login.passwordPlaceholder")}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full cursor-pointer">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("login.loginButton")}
          </Button>
        </form>
      </Form>
    </Card>
  );
};
