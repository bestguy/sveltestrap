<script>
	import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';
</script>

<Pagination size="sm" ariaLabel="Page navigation example">
	<PaginationItem>
		<PaginationLink first href="#" />
	</PaginationItem>
	<PaginationItem>
		<PaginationLink previous href="#" />
	</PaginationItem>
	<PaginationItem>
		<PaginationLink href="#">
			1
		</PaginationLink>
	</PaginationItem>
	<PaginationItem>
		<PaginationLink href="#">
			2
		</PaginationLink>
	</PaginationItem>
	<PaginationItem>
		<PaginationLink href="#">
			3
		</PaginationLink>
	</PaginationItem>
	<PaginationItem>
		<PaginationLink next href="#" />
	</PaginationItem>
	<PaginationItem>
		<PaginationLink last href="#" />
	</PaginationItem>
</Pagination>
