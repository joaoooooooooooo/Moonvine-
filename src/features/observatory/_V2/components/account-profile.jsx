import { useState } from 'react';
import { Card, CardPanel, CardFooter } from '@/components/ui/card';
import { PageHeading } from './page-heading';
import { Form } from '@/components/ui/form';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { ObservatoryInput as Input } from './observatory-input';
import { Button } from '@/components/ui/button';
import { accountHref } from '../utils/observatory-model';

export function AccountProfile({ model }) {
  const { account, saveProfile } = model;
  const [name, setName] = useState(account.name);
  const [domain, setDomain] = useState(account.domain);
  return (
    <div className="space-y-6 [&>:first-child]:pb-4">
      <PageHeading title="Manage the organization name and domain." />
      <Card>
        <Form className="contents" onSubmit={(event) => { event.preventDefault(); saveProfile({ name: name.trim(), domain: domain.trim() }); }}>
          <CardPanel className="max-w-xl space-y-5">
            <Field name="name"><FieldLabel>Organization name</FieldLabel><Input required value={name} onChange={(event) => setName(event.target.value)} /><FieldError /></Field>
            <Field name="domain"><FieldLabel>Domain</FieldLabel><Input required value={domain} onChange={(event) => setDomain(event.target.value)} /><FieldError /></Field>
          </CardPanel>
          <CardFooter className="gap-3"><Button type="submit" disabled={!name.trim() || !domain.trim()}>Save changes</Button><Button variant="secondary" render={<a href={accountHref(account.id)} />}>Cancel</Button></CardFooter>
        </Form>
      </Card>
    </div>
  );
}
