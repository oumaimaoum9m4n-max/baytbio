import { toast } from "@/components/ui";
import { ErrorResponse, MutationResponse } from "./types";
import { AxiosError } from "axios";

export const onMutationSuccess = (msg: MutationResponse) => {
  toast.success({
    title : 'Succès',
    description : msg.msg
  });
};

export const onMutationError = (error: AxiosError) => {
  const msg = error.response?.data as ErrorResponse;
  console.log(msg);

  toast.error({
    title : 'Succ',
    description : msg.msg
  });
};
