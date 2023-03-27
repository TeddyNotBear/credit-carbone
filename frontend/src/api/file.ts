import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi, methods } from "./fetchApi";

export interface uploadToIPFSArgs {
    jsonData: Array<string>;
    onSuccess?: (successCallbackData: any) => void;
    onError?: (error: Error) => void;
}

export interface uploadArgs {
    jsonData: Array<string>;
    type: string;
    email: string;
    onSuccess?: (successCallbackData: any) => void;
    onError?: (error: Error) => void;
}

const URI = '/api/file';

export const useUploadToIPFS = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        { message: string; mutationResult: any },
        Error,
        uploadToIPFSArgs
    >({
       mutationFn: async ({ jsonData }: uploadToIPFSArgs): Promise<{ message: string; mutationResult: any }> =>
        fetchApi({
            uri: `${URI}/uploadToIPFS`,
            method: methods.POST,
            body: { jsonData }
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

    return { ...mutation, uploadToIPFS: mutation.mutate };
};

export const useUpload = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        { message: string; mutationResult: any },
        Error,
        uploadArgs
    >({
       mutationFn: async ({ jsonData, type, email }: uploadArgs): Promise<{ message: string; mutationResult: any }> =>
        fetchApi({
            uri: `${URI}/upload`,
            method: methods.POST,
            body: { jsonData, type, email }
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

    return { ...mutation, upload: mutation.mutate };
};