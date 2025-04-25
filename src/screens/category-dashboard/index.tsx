import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import CreateCategoryForm from "./create-category-form";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { useEffect, useState } from "react";
import { clearError, deleteCategory, fetchCategories } from "@/app/redux/categories/categories-slice";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import UpdateCategoryForm from "./update-category-form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import CategoryDto from "@/app/models/category-dto";

function CategoryDashboard() {
  const { categories, success, error } = useAppSelector(state => state.categories);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (success) {
      toast.success(success.title, {
        description: success.detail
      });

      dispatch(clearError());
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      toast.error(error.title, {
        description: error.detail
      });

      dispatch(clearError());
    }
  }, [error]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  const [createCategoryFormOpen, setCreateCategoryFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto | undefined>(undefined);

  return (
    <>
      <CreateCategoryForm open={createCategoryFormOpen} setOpen={setCreateCategoryFormOpen} />
      <UpdateCategoryForm selectedCategory={selectedCategory} unselectCategory={() => setSelectedCategory(undefined)} />

      <header className="sticky top-0 z-50 bg-background flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-4 h-4" />
        <span className="mr-auto">Categories</span>
        
        <Button onClick={() => setCreateCategoryFormOpen(true)}>New Category</Button>  
      </header>

      <div className="flex flex-col">
        <div className="p-4 w-full">
          <ScrollArea>
            <Table className="w-full">
              <TableCaption>All categories of RookieShop</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => {
                  return (
                    <TableRow key={category.id}>
                      <TableCell>{category.id}</TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell className="max-w-200 text-ellipsis overflow-hidden">{category.description}</TableCell>
                      <TableCell>
                        <Button onClick={() => setSelectedCategory(category)}>Edit</Button>
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>Are you sure you want to delete category "{category.name}"?</AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => dispatch(deleteCategory({ id: category.id }))}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
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

export default CategoryDashboard;