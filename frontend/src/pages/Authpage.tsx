import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./auth/components/Login";
import Signup from "@/pages/auth/components/Signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Zap, Sparkles, Lock } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Footer } from "@/components/shared/Footer";

const features = [
  {
    title: "Lightning Fast",
    description: "Real-time messaging with zero lag.",
    icon: Zap,
    gradient: "from-blue-600 to-purple-600",
  },
  {
    title: "Team Collaboration",
    description: "Collaborate with your team members.",
    icon: Users,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Connect with friends",
    description: "Chat with your friends and family.",
    icon: Users,
    gradient: "from-pink-500 to-orange-500",
  },
  {
    title: "Customizable themes",
    description: "Choose from a wide range of themes.",
    icon: Sparkles,
    gradient: "from-orange-500 to-amber-500",
  },
];
function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfoStr = localStorage.getItem("userInfo");
    const user = userInfoStr ? JSON.parse(userInfoStr) : null;
    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col container mx-auto max-w-7xl">
      <header className="relative z-10 w-full mx-auto px-4 py-6">
        <div className="flex items-center justify-between select-none">
          <div className="w-12 h-12">
            <img
              src="/logo.svg"
              alt="logo"
              className="w-full h-full dark:invert"
            />
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 lg:gap-12 max-w-7xl mx-auto">
            <div className="typography space-y-8  select-none">
              <div className="flex flex-col sm:flex-row lg:flex-col space-y-6">
                <img
                  src="/bg-frames/Frame4.svg"
                  className="w-full h-20 sm:h-32 lg:h-20"
                  alt=""
                />
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                    Connect, Chat, and Collaborate
                  </h1>
                  <p>
                    Experience the future of communication with our beautifully
                    designed, feature-rich chat platform. Connect with friends,
                    collaborate with teams, and express yourself like never
                    before.
                  </p>
                </div>
              </div>

              <div className="hidden lg:grid grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="group p-4 rounded-2xl border">
                    <div
                      className={`w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3`}
                    >
                      <feature.icon className="w-5 h-5 text-foreground" />
                    </div>
                    <h3>{feature.title}</h3>
                    <p className="!text-xs xl:!text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center items-center w-full">
              <Card className="inverted-radius bg-[#eeecec] dark:bg-[#141414] w-full max-w-md h-fit">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Lock className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your account or create a new one to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-2 typography">
                      <TabsTrigger value="login">Sign In</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login" className="space-y-4">
                      <Login />
                    </TabsContent>
                    <TabsContent value="signup" className="space-y-4">
                      <Signup />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Homepage;
