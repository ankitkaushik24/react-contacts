import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, redirect, RouterProvider} from "react-router-dom";
import Root from "./routes/root.jsx";
import ErrorPage from "./routes/error.jsx";
import Contact from "./routes/contact.jsx";
import {createContact, deleteContact, getContact, getContacts, updateContact} from "./contacts.js";
import EditContact from "./routes/edit-contact.jsx";

const rootRouter = createBrowserRouter([
  {
    path: '',
    element: <Root/>,
    loader: ({request}) => {
      const url = new URL(request.url);
      const search = url.searchParams.get('q');
      return getContacts().then(contacts => {
        return {
          contacts: search?.trim() ? contacts.filter(contact => {
            return (contact.first + contact.last)?.includes?.(search);
          }) : contacts, search
        };
      });
    },
    action: () => {
      return createContact().then(contact => redirect(`contacts/${contact.id}/edit`));
    },
    errorElement: <ErrorPage/>,
    children: [
      {
        errorElement: <ErrorPage/>,
        children: [{
          path: 'contacts/:id',
          element: <Contact/>,
          action: async ({request, params}) => {
            const formData = await request.formData();
            return updateContact(params.id, {favorite: formData.get('favorite') === 'true'})
          },
          children: [
            {
              path: 'destroy',
              action: ({params}) => {
                throw new Error("oh dang!");
                return deleteContact(params.id).then(() => redirect('/'))
              },
              errorElement: <div>Oops! something went wrong</div>
            }
          ],
          loader: ({params}) => {
            return getContact(params.id).then(contact => ({contact}));
          }
        },
          {index: true, element: <div>Root default child!</div>},
          {
            path: 'contacts/:id/edit',
            element: <EditContact/>,
            loader: ({params: {id}}) => getContact(id).then(contact => ({contact})),
            action: ({params, request}) => {
              return request.formData()
              .then(formData => Object.fromEntries(formData))
              .then(updates => updateContact(params.id, updates))
              .then(() => redirect(`/contacts/${params.id}`))
              .catch(e => console.error(e));
            }
          }]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={rootRouter}/>
  </React.StrictMode>,
)
