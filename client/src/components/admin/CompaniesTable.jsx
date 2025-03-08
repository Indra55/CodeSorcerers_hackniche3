import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CompaniesTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        {/* Table header */}
        <tbody>
          <AnimatePresence>
            {data.map((company, index) => (
              <TableRow key={company.id} company={company} index={index} />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

function TableRow({ company, index }) {
  return (
    <motion.tr
      className="border-b"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {/* Keep original table row JSX */}
    </motion.tr>
  );
}