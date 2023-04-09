import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi, methods } from "./fetchApi";

export interface uploadToIPFSArgs {
    jsonData: Array<string>;
    email: string;
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

export interface verifArgs {
    jsonData: Array<string>;
    email: string;
    onSuccess?: (successCallbackData: any) => void;
    onError?: (error: Error) => void;
}

export interface GetUCOByEmailArgs {
    onSuccess?: (successCallbackData: any) => void;
    onError?: (error: Error) => void;
}

export interface PutOnSaleSCCArgs {
    sccId: string;
    email: string;
    onSuccess?: (successCallbackData: any) => void;
    onError?: (error: Error) => void;
}

export interface RemoveFromSaleSCCArgs {
    sccId: string;
    email: string;
    onSuccess?: (successCallbackData: any) => void;
    onError?: (error: Error) => void;
}

export interface CompensateSCCArgs {
    sccId: string;
    onSuccess?: (successCallbackData: any) => void;
    onError?: (error: Error) => void;
}

export interface GetRetirementStatus {
    sccId: string;
    onSuccess?: (successCallbackData: any) => void;
    onError?: (error: Error) => void;
}

const URI = '/api/file';

export const useGetUCOByEmail = () => {
    const query = useQuery<any, Error>({
      queryKey: [URI],
      queryFn: async (): Promise<any> => {
        return fetchApi({
          uri: `${URI}/uco/user/${localStorage.getItem('userEmail')}`,
          method: methods.GET,
        });
      },
      enabled: localStorage.getItem('userEmail') !== ''
    });
    return { ...query, ucosData: query.data };
};

export const useGetSCCByEmail = () => {
    const query = useQuery<any, Error>({
      queryKey: [URI],
      queryFn: async (): Promise<any> => {
        return fetchApi({
          uri: `${URI}/scc/user/${localStorage.getItem('userEmail')}`,
          method: methods.GET,
        });
      },
      enabled: localStorage.getItem('userEmail') !== ''
    });
    return { ...query, sccsData: query.data };
};

export const useUploadToIPFS = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        { message: string; mutationResult: any },
        Error,
        uploadToIPFSArgs
    >({
       mutationFn: async ({ jsonData, email }: uploadToIPFSArgs): Promise<{ message: string; mutationResult: any }> =>
        fetchApi({
            uri: `${URI}/uploadToIPFS`,
            method: methods.POST,
            body: { jsonData, email }
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

export const useVerif = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        { message: string; mutationResult: any },
        Error,
        verifArgs
    >({
       mutationFn: async ({ jsonData, email }: verifArgs): Promise<{ message: string; mutationResult: any }> =>
        fetchApi({
            uri: `${URI}/verif`,
            method: methods.POST,
            body: { jsonData, email }
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

    return { ...mutation, verif: mutation.mutate };
};

export const usePutOnSaleSCC = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        { message: string; mutationResult: any },
        Error,
        PutOnSaleSCCArgs
    >({
       mutationFn: async ({ sccId, email }: PutOnSaleSCCArgs): Promise<{ message: string; mutationResult: any }> =>
        fetchApi({
            uri: `${URI}/scc/putOnSale`,
            method: methods.PUT,
            body: { sccId, email }
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

    return { ...mutation, putOnSaleSCC: mutation.mutate };
};

export const useRemoveFromSaleSCC = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        { message: string; mutationResult: any },
        Error,
        RemoveFromSaleSCCArgs
    >({
       mutationFn: async ({ sccId, email }: RemoveFromSaleSCCArgs): Promise<{ message: string; mutationResult: any }> =>
        fetchApi({
            uri: `${URI}/scc/removeFromSale`,
            method: methods.PUT,
            body: { sccId, email }
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

    return { ...mutation, removeFromSaleSCC: mutation.mutate };
};

export const useGetSCCOnSale = () => {
    const query = useQuery<any, Error>({
      queryKey: [URI],
      queryFn: async (): Promise<any> => {
        return fetchApi({
          uri: `${URI}/scc/onSale`,
          method: methods.GET,
        });
      },
    });
    return { ...query, sccsData: query.data };
};

export const useCompensateSCC = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        { message: string; mutationResult: any },
        Error,
        CompensateSCCArgs
    >({
       mutationFn: async ({ sccId }: CompensateSCCArgs): Promise<{ message: string; mutationResult: any }> =>
        fetchApi({
            uri: `${URI}/scc/compensate`,
            method: methods.PUT,
            body: { sccId }
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

    return { ...mutation, compensateSCC: mutation.mutate };
};

export const useGetRetirementStatus = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        { message: string; mutationResult: any },
        Error,
        CompensateSCCArgs
    >({
       mutationFn: async ({ sccId }: GetRetirementStatus): Promise<{ message: string; mutationResult: any }> =>
        fetchApi({
            uri: `${URI}/scc/retirementStatus`,
            method: methods.POST,
            body: { sccId }
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

    return { ...mutation, getRetirementStatus: mutation.mutate };
};