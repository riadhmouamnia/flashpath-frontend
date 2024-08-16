import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="flex mt-10 justify-center items-center">
      <SignIn />
    </div>
  );
};

export default SignInPage;
