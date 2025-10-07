import { authApiServices } from "@/api/auth.service";
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
import { SchemaRegister } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Icons } from "../common/icons";

export const Register = () => {
  const { t } = useTranslation("auth");
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof SchemaRegister>>({
    resolver: zodResolver(SchemaRegister),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const handleRegister = async (
    email: string,
    password: string,
    fullname: string
  ) => {
    try {
      const response = await authApiServices.register(
        email,
        password,
        fullname
      );

      if (response) {
        if (response.data.status === 404) {
          toast.error(t("register.alreadyUsedEmailError"));
          return;
        }
        toast.success(t("register.registeredSuccess"));

        return response;
      } else {
        throw new Error(t("register.registrationFailed"));
      }
    } catch {
      toast.error(t("register.alreadyUsedEmailError"));
    }
  };

  async function onSubmit(values: z.infer<typeof SchemaRegister>) {
    setIsLoading(true);
    await handleRegister(values.email, values.password, values.name);
    form.reset(
      { email: "", password: "", name: "" },
      { keepDirtyValues: false }
    );
    setIsLoading(false);
  }
  return (
    <Card className="p-2">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl ">{t("register.title")}</CardTitle>
        <CardDescription>{t("register.description")}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-3 content-start items-start flex-col space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-col items-start content-start w-full">
                <FormLabel className="text-start w-full">
                  {t("register.name")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("register.namePlaceholder") || ""}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-col items-start content-start w-full">
                <FormLabel className="text-start w-full">
                  {t("register.email")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("register.emailPlaceholder") || ""}
                    {...field}
                  />
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
                  {t("register.password")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("register.passwordPlaceholder") || ""}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full cursor-pointer">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("register.submitButton")}
          </Button>
        </form>
      </Form>
    </Card>
  );
};
