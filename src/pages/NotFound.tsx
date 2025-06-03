import { Button, Link } from "@heroui/react";

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-gray-500 mb-4">The page you are looking for does not exist or has been moved.</p>
      <Link href="/">
        <Button color="primary">Go Home</Button>
      </Link>
    </div>
  );
};
