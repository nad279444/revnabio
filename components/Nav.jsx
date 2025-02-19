
'use client';

import { useState } from 'react';
import { Button, Tooltip } from '@nextui-org/react';
import { CirclePlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserFormModal from '@/components/UserFormModal';
import Link from 'next/link';

const Nav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <nav className="h-[65px] border-b border-default-50 flex items-center justify-between px-6 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Revnabio
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Tooltip content="Add New User" placement="bottom">
            <Button isIconOnly variant="ghost" size="sm" onPress={toggleModal}>
              <CirclePlus size={20} />
            </Button>
          </Tooltip>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </nav>

      {/* Modal */}
      <UserFormModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
};




export default Nav;
