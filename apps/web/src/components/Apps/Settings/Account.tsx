import { Button } from '@/ui/button'
import { Form } from '@/ui/Cards/AuthFlow/Form'
import { Input, InputPassword } from '@/ui/input'
import { Icons } from '@skydock/ui/icons'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

interface CommonProps {
    closeModal: () => void
}

const ChangePassword = ({ closeModal }: CommonProps) => {
    return (
        <motion.div
            className=" bg-white p-4 rounded-md shadow border w-full max-w-96"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
        >
            <div className='flex justify-between items-center'>
                <h3 className="font-medium">Change Password</h3>
                <Button
                    onClick={closeModal}
                >
                    <Icons.Cross className="w-5 h-5" />
                </Button>
            </div>
            <div className="w-[95%] pb-2 border-b border-gray-200"></div>

            <Form onSubmit={() => { }} className=" py-2 w-full">
                <label className=" text-sm self-start" htmlFor="current-password">Current Password</label>
                <InputPassword id='current-password' className=' placeholder:text-sm placeholder:text-gray-400' />
                {/* {formError.email && <ErrorMessage>{formError.email}</ErrorMessage>} */}
                <label className="text-sm self-start" htmlFor="new-password">New Password</label>
                <InputPassword id='new-password' className=' placeholder:text-sm placeholder:text-gray-400' />
                <label className="text-sm self-start" htmlFor="confirm-new-password">Confirm Password</label>
                <InputPassword id='confirm-new-password' className=' placeholder:text-sm placeholder:text-gray-400' />
                <Button intent={'action'} className='py-1 mt-2' size={'medium'}>Change Password</Button>
            </Form>
        </motion.div>
    )
}

const ChangeEmail = ({ closeModal }: CommonProps) => {
    return (
        <motion.div
            className=" bg-white p-4 rounded-md shadow border w-full max-w-96"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
        >
            <div className='flex justify-between items-center'>
                <h3 className="font-medium">Change Email</h3>
                <Button
                    onClick={closeModal}
                >
                    <Icons.Cross className="w-5 h-5" />
                </Button>
            </div>
            <div className="w-[95%] pb-2 border-b border-gray-200"></div>

            <Form onSubmit={() => { }} className=" py-2 w-full">
                <label className=" text-sm self-start" htmlFor="new-email">New Email</label>
                <Input id='new-email' type='email' className=' placeholder:text-sm placeholder:text-gray-400' />
                {/* {formError.email && <ErrorMessage>{formError.email}</ErrorMessage>} */}
                <label className="text-sm self-start" htmlFor="-password">Verify Account Password</label>
                <InputPassword id='-password' className=' placeholder:text-sm placeholder:text-gray-400' />
                <Button intent={'action'} className='py-1 mt-2' size={'medium'}>Change Password</Button>
            </Form>
        </motion.div>
    )
}



const Account = () => {
    const [openModal, setOpenModal] = useState<string | null>(null)

    const closeModal = () => {
        setOpenModal(null)
    }

    const options = [
        {
            id: '01',
            name: 'Change Password',
            Component: ChangePassword
        },
        {
            id: '02',
            name: 'Change Email',
            Component: ChangeEmail
        }
    ]

    return (
        <>
            <div className='flex flex-col gap-4'>
                <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                >
                    <h3 className="font-medium">Account</h3>
                    <div className='space-y-4'>
                        {options.map(({ id, name }, index) => (
                            <Button className="flex gap-3 bg-white w-full max-w-96 shadow backdrop-blur px-3 py-3 rounded-md"
                                key={id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setOpenModal(id)}
                            >
                                <div className=" w-full text-sm flex items-center justify-between">
                                    <div>{name}</div>
                                    <Icons.Right_Arrow className="w-5 h-5" />
                                </div>
                            </Button>
                        ))}
                    </div>
                </motion.div>
            </div>
            <AnimatePresence>
                {openModal && (
                    <motion.div
                        className=' absolute bg-black/20 transition h-full w-full flex items-center justify-center top-0 left-0 backdrop-blur'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {options.find(option => option.id === openModal)?.Component({ closeModal })}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Account