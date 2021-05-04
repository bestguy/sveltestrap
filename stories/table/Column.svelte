<script lang="ts">
  import { Column, Table } from 'sveltestrap';

  const ROWS = [
		{ first: 'Rufus', last: 'Sarsparilla', email: 'rufus.sarsparilla@example.com', dob: new Date(1968, 6, 15) },
		{ first: 'Albert', last: 'Armadillo', email: 'albert.armadillo@example.com', dob: new Date(1972, 7, 17) },
		{ first: 'Arron', last: 'Douglas', email: 'arron.douglas@example.com', dob: new Date(1982, 4, 1) },
		{ first: 'Reginald', last: 'Rhodes', email: 'reginald.rhodes@example.com', dob: new Date(1968, 8, 14) },
		{ first: 'Jimmy', last: 'Mendoza', email: 'jimmy.mendoza@example.com', dob: new Date(1964, 1, 1) },
		{ first: 'Georgia', last: 'Montgomery', email: 'georgia.montgomery@example.com', dob: new Date(1960, 6, 4) },
		{ first: 'Serenity', last: 'Thomas', email: 'serenity.thomas@example.com', dob: new Date(1973, 0, 11) },
		{ first: 'Tonya', last: 'Elliott', email: 'tonya.elliott@example.com', dob: new Date(1954, 7, 17) },
		{ first: 'Maxine', last: 'Turner', email: 'maxine.turner@example.com', dob: new Date(1961, 8, 19) },
		{ first: 'Max', last: 'Headroom', email: 'max.headroom@example.com', dob: new Date(1984, 6, 1) }
	];
</script>

<Table rows={ROWS} let:row>
  <Column header="First Name" width="8rem">
    {row.first}
  </Column>
  <Column header="Last Name" width="8rem">
    {row.last}
  </Column>
  <Column header="Email">
    {row.email}
  </Column>
  <Column header="Birthdate" width="10rem" class="text-right">
    {row.dob.toDateString()}
  </Column>
</Table>

