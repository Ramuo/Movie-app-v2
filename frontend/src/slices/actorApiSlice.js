import {apiSlice} from "./apiSlice";
import { ACTORS_URL } from "../constant";



const actorApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createActor: builder.mutation({
            query: (data) => ({
                url: `${ACTORS_URL}/create`,
                method: 'POST',
                body: data
            }),
        }),
        uploadavatar: builder.mutation({
            query: (data) => ({
                url: `${ACTORS_URL}/uploadavatar`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Actor'],
        }),
        updateActor: builder.mutation({
            query: (data) => ({
                url: `${ACTORS_URL}/${data.actorId}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['Actor'],
        }),
        deleteActor: builder.mutation({
            query: (actorId) => ({
              url: `${ACTORS_URL}/${actorId}`,
              method: 'DELETE',
            }),
            providesTags: ['Product'],
        }),
    }),
});


export const {
   useCreateActorMutation,
   useUploadavatarMutation,
   useUpdateActorMutation,
   useDeleteActorMutation
}= actorApiSlice;