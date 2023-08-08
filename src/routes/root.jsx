import {Form, Link, NavLink, Outlet, useLoaderData, useNavigation, useSubmit} from "react-router-dom";

export default function Root() {
  const {contacts} = useLoaderData();
  const {state, location: nLocation} = useNavigation();
  const submit = useSubmit();

  const search = new URLSearchParams(location.search).get('q')

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={search}
              onChange={e => submit(e.target.form, {replace: !!search})}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={!nLocation?.search}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink to={`contacts/${contact.id}`}
                           className={({
                                         isActive,
                                         isPending
                                       }) => (isActive && 'active') || (isPending && 'pending') || ''}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail" className={state === 'loading' ? 'loading' : ''}>
        <Outlet/>
      </div>
    </>
  );
}
