import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <h1 className="text-5xl font-bold mb-4 text-primary">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="mb-6 text-muted-foreground text-center max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Button asChild variant="default" size="lg">
        <Link to="/">Go to Home</Link>
      </Button>
    </div>
  );
};

export default NotFound; 