import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi, methods } from "./fetchApi";

export interface CreateNewUserArgs {
    email: string;
    wallet_address: string;
    role: string;
    onSuccess?: (successCallbackData: any) => void;
    onError?: (error: Error) => void;
}

const URI = '/api/user';

export const useCreateNewUser = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        { message: string; mutationResult: any },
        Error,
        CreateNewUserArgs
    >({
       mutationFn: async ({ email, wallet_address, role }: CreateNewUserArgs): Promise<{ message: string; mutationResult: any }> =>
        fetchApi({
            uri: `${URI}/`,
            method: methods.POST,
            body: { email, wallet_address, role }
        }),
        onSuccess: (data, { onSuccess }) => {
            queryClient.invalidateQueries([URI]);
            if (onSuccess) {
                onSuccess(data);
            }
        },
        onError: (error, { onError }) => {
            if (onError) {
                onError(error);
            }
        },
    });

    return { ...mutation, mutationFunc: mutation.mutate };
};