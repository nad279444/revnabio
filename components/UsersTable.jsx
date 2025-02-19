'use client';

import { useState, useEffect } from 'react';
import { getUsers } from '@/actions/getUsers';
import {  deleteUser } from '@/actions/deleteUser';
import {  updateUser } from '@/actions/updateUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { MoreHorizontal } from 'lucide-react';

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  // Filter users based on search input
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  // Open Edit Dialog
  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setIsDialogOpen(true);
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setEditingUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle Role Change
  const handleRoleChange = (role) => {
    setEditingUser((prev) => ({ ...prev, role }));
  };

  // Handle Permissions Change
  const handlePermissionsChange = (e) => {
    setEditingUser((prev) => ({
      ...prev,
      permissions: e.target.value.split(',').map((perm) => perm.trim()),
    }));
  };

  // Update User
  const handleUpdateUser = async () => {
    if (!editingUser) return;

    await updateUser(editingUser);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === editingUser.id ? { ...editingUser } : user
      )
    );

    setIsDialogOpen(false);
  };

  // Delete User
  const handleDeleteUser = async (userId) => {
    await deleteUser(userId);
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-24 pb-10">
      <h1 className="text-lg text-center pt-10 py-10 text-blue-700 font-bold">
        User Management
      </h1>

      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search users..."
        className="mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Name</TableHead>
              <TableHead className="whitespace-nowrap">Email</TableHead>
              <TableHead className="whitespace-nowrap">Role</TableHead>
              <TableHead className="whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
            
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost">
                          <MoreHorizontsl size={20} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40">
                        <Button
                          variant="ghost"
                          className="w-full text-left"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full text-left text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={editingUser?.name || ''}
              onChange={handleChange}
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={editingUser?.email || ''}
              onChange={handleChange}
            />
            <Select value={editingUser?.role || 'USER'} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              name="permissions"
              placeholder="Enter permissions (comma separated)"
              value={editingUser?.permissions?.join(', ') || ''}
              onChange={handlePermissionsChange}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateUser}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
