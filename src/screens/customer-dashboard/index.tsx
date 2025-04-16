import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { fetchCustomerPage } from "@/app/redux/customers/customers-slice";
import { useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function CustomerDashboard() {
  const dispatch = useAppDispatch();
  const { customers, currentPageNumber, pageSize } = useAppSelector(state => state.customers);
  
  useEffect(() => {
    dispatch(fetchCustomerPage({
      pageNumber: currentPageNumber,
      pageSize: pageSize
    }));
  }, [currentPageNumber, pageSize]);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-4 h-4" />
        <span className="mr-auto">Customers</span>
      </header>

      <div className="flex flex-col w-full">
        <div className="m-4 w-full">
          <ScrollArea>
            <Table className="w-full">
              <TableCaption>All customers of RookieShop</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {customers.map(customer => {
                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarFallback>{customer.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{customer.username}</TableCell>
                      <TableCell>{customer.firstName}</TableCell>
                      <TableCell>{customer.lastName}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

export default CustomerDashboard;