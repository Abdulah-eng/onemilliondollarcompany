import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findProgramByIdAndType } from "@/mockdata/viewprograms/programFinder";

export default function LegacyProgramRedirect() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/customer/programs", { replace: true });
      return;
    }

    // Try to find the program by checking all types
    const types = ["fitness", "nutrition", "mental"];
    
    for (const type of types) {
      const program = findProgramByIdAndType(type, id);
      if (program) {
        navigate(`/program/${type}/${id}`, { replace: true });
        return;
      }
    }

    // If no program found, redirect to programs page
    navigate("/customer/programs", { replace: true });
  }, [id, navigate]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}