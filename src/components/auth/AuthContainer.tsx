import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface AuthContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthContainer = ({ children, title, subtitle }: AuthContainerProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-cyan-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md p-6 glass-effect">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 text-center"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-gray-300 mt-2">{subtitle}</p>
          </motion.div>
          {children}
        </Card>
      </motion.div>
    </div>
  );
};