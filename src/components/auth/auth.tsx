import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Login } from "./login";
import { Register } from "./register";

export const Auth = () => {
  const { t } = useTranslation("auth");
  return (
    <div className=" relative bg-white w-full h-screen flex col content-center items-center justify-center ">
      <div className="relative w-full   h-full flex-col bg-muted p-10 text-white dark:border-r  ">
        <div className="relative z-20 hidden items-center text-lg font-medium md:flex">
          <Link reloadDocument to="/">
            <img src={"/assets/logo-dark.svg"} alt="" width={152} height={26} />
          </Link>
        </div>
        <div className="lg:p-8 flex items-center justify-center">
          <div className=" flex w-full items-center flex-row justify-center space-y-6 sm:w-[450px]">
            <Tabs defaultValue="register" className="w-[450px]">
              <TabsList>
                <TabsTrigger className="cursor-pointer" value="login">
                  {t("tabs.login")}
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="register">
                  {t("tabs.register")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Login />
              </TabsContent>
              <TabsContent value="register">
                <Register />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
