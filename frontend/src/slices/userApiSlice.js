import {apiSlice} from "./apiSlice";
import { USERS_URL } from "../constant";



const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: 'POST',
                body: data
            }),
        }),
        emailVerification: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/email-verification`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['User']
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),
        forgotpassword: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/forgot-password`,
                method: 'POST',
                body: data
            }),
        }),
        resetpassword: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/reset-password/${data.token}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['User'],
        }),
    }),
});


export const {
    useLoginMutation,
    useRegisterMutation,
    useEmailVerificationMutation,
    useLogoutMutation,
    useForgotpasswordMutation,
    useResetpasswordMutation,
}= userApiSlice;