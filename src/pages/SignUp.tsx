import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import GradientBorder from "@/components/GradientBorder";
import signUpImage from "@/assets/img/signUpImage.png";
import { useRegister } from "@/hooks/useRegister";

export default function SignUp() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const { formData, error, success, loading, handleInputChange, handleSubmit } =
    useRegister();

  const handleTogglePassword = () => setShowPassword(!showPassword);

  return (
    <div
      className="relative flex h-screen text-white bg-black overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(159.02deg, rgb(77, 83, 166) 14.25%, #090D2E 56.45%, rgb(58, 68, 122) 86.14%)",
      }}
    >
      <div className="h-full w-full max-w-[1044px] mx-auto pt-[100px] md:pt-0 flex flex-col lg:mr-[50px] xl:mx-auto overflow-hidden">
        <div className="flex items-center justify-start select-none mx-auto lg:mx-0 lg:ms-auto w-full md:w-1/2 lg:w-[450px] px-[50px]">
          <div className="flex flex-col w-full bg-transparent mt-[50px] md:mt-[150px] lg:mt-[160px] xl:mt-[245px] mb-[60px] lg:mb-[95px]">
            <h1 className="text-[32px] font-bold text-white mb-[10px]">
              {t("welcome")}
            </h1>
            <p className="mb-[36px] ml-[4px] text-gray-400 font-bold text-[14px]">
              {t("signup_description")}
            </p>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm mb-4">{success}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <Label className="ml-[4px] text-sm font-normal text-white">
                  {t("name_label")}
                </Label>
                <GradientBorder
                  className="mt-2 mb-[24px] w-full lg:w-fit"
                  borderRadius="20px"
                >
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t("name_placeholder")}
                    className="bg-[rgb(19,21,54)] border-none rounded-[20px] text-white text-sm h-[46px] w-full md:w-[346px] max-w-full focus:border-none focus:ring-0 px-4"
                  />
                </GradientBorder>
              </div>

              {/* Email */}
              <div>
                <Label className="ml-[4px] text-sm font-normal text-white">
                  {t("email_label")}
                </Label>
                <GradientBorder
                  className="mt-2 mb-[24px] w-full lg:w-fit"
                  borderRadius="20px"
                >
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t("email_placeholder")}
                    className="bg-[rgb(19,21,54)] border-none rounded-[20px] text-white text-sm h-[46px] w-full md:w-[346px] max-w-full focus:border-none focus:ring-0 px-4"
                  />
                </GradientBorder>
              </div>

              {/* Password */}
              <div>
                <Label className="ml-[4px] text-sm font-normal text-white">
                  {t("password_label")}
                </Label>
                <GradientBorder
                  className="mt-2 mb-[24px] w-full max-w-[346px] max-md:max-w-[346px] max-md:w-full mx-auto"
                  borderRadius="20px"
                >
                  <div className="relative w-full max-w-[346px] max-md:max-w-[346px] max-md:w-full">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t("password_placeholder")}
                      className="bg-[rgb(19,21,54)] border-none rounded-[20px] text-white text-sm h-[46px] w-full max-w-[346px] max-md:max-w-[346px] max-md:w-full focus:border-none focus:ring-0 px-4 pr-8"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-white h-[10px] w-[10px] rounded-[20px]"
                      onClick={handleTogglePassword}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </GradientBorder>
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full max-w-[350px] h-[45px] mt-[20px] mb-[20px] bg-[var(--primary)] hover:bg-opacity-90 text-white text-[10px] font-bold transition-opacity duration-200 cursor-pointer"
              >
                {loading ? t("loading") : t("sign_up_button")}
              </Button>

              {/* Sign In Link */}
              <div className="flex flex-col justify-center items-center max-w-full mt-0">
                <p className="text-gray-400 font-medium">
                  {t("already_have_account")}{" "}
                  <Link
                    to="/auth/signin"
                    className="text-white ml-[5px] font-bold"
                  >
                    {t("sign_in_link")}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Image (visible only on large screens) */}
        <div className="hidden lg:block h-full max-w-[50vw] w-[960px] absolute left-0 top-0 bg-black overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center absolute flex flex-col justify-center items-center"
            style={{ backgroundImage: `url(${signUpImage})` }}
          >
            <p className="text-center text-white tracking-[8px] text-[20px] font-medium">
              {t("inspired_future")}
            </p>
            <h2
              className="text-center text-[36px] font-bold text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(94.56deg, #FFFFFF 79.99%, #21242F 102.65%)",
              }}
            >
              {t("app_name")}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
