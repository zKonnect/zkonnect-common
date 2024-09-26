import { constructMetaData } from "@/lib/metadata";
import CreatorSignupForm from "@/components/CreatorSignup/CreatorSignupForm";

export const metadata = constructMetaData({
  title: "Creator Sign Up | zKonnect",
  description: "This is the creator sign-up of zKonnect",
});

const SignupPage = () => {
  return (
    <section className="flex h-screen flex-col items-center px-6 pt-10 lg:pt-48">
      <div className="flex min-h-[400px] flex-col items-center space-y-4 lg:space-y-8">
        <h1 className="text-start text-2xl font-bold text-black lg:text-3xl">
          Tell Us About Yourself to Begin
        </h1>
        <CreatorSignupForm />
      </div>
    </section>
  );
};

export default SignupPage;
