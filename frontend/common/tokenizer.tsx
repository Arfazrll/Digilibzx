import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const verifyToken = (): boolean => {
    const token = Cookies.get("authToken");
    if(token){
        return true;
    }
    return false;
  }

export const deleteToken = () => {
  Cookies.remove("authToken");
  localStorage.removeItem("userId");
}

export function useAuthGuard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const isTokenValid = verifyToken();
      if (!isTokenValid) {
        toast.error("Kamu harus login dulu!");
        router.push("/login");
      } else {
        setIsLoading(false); // Set loading selesai jika token valid
      }
    };

    checkToken();
  }, [router]);

  return { isLoading };
}
