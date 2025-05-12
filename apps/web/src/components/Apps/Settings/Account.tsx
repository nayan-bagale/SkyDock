import ErrorMessage from '@/components/Auth/ErrorMessage'
import { useChangeNameMutation, useChangePasswordMutation, useSetPasswordMutation } from '@/redux/apis/userAuthApi'
import { useAppSelector } from '@/redux/hooks'
import { Button } from '@/ui/button'
import { Form } from '@/ui/Cards/AuthFlow/Form'
import { Input, InputPassword } from '@/ui/input'
import { Icons } from '@skydock/ui/icons'
import { showToast } from '@skydock/ui/toast'
import { AnimatePresence, motion } from 'framer-motion'
import { memo, useState } from 'react'

interface CommonProps {
    closeModal: () => void
}

const ChangeName = memo(({ closeModal }: CommonProps) => {

    const [changeName, { isLoading }] = useChangeNameMutation()
    const [formError, setFormError] = useState({
        firstName: '',
        lastName: ''
    })

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setFormError({
            firstName: '',
            lastName: ''
        })
        const firstName = e.target[0].value
        const lastName = e.target[1].value
        if (!firstName) {
            setFormError((prev) => ({ ...prev, firstName: 'First name is required' }))
            return
        }
        if (!lastName) {
            setFormError((prev) => ({ ...prev, lastName: 'Last name is required' }))
            return
        }
        try {
            const res = await changeName({ fname: firstName, lname: lastName }).unwrap()
            console.log(res)
            closeModal()
            showToast(
                res.message ?? 'Name changed successfully',
                'success'
            )
        } catch (e: any) {
            console.log(e)
            showToast(
                e.data.message,
                'error'
            )
        }
    }

    return (
        <motion.div
            className=" bg-white p-4 rounded-md shadow border w-full max-w-96"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
        >
            <div className='flex justify-between items-center'>
                <h3 className="font-medium">Change Name</h3>
                <Button
                    onClick={closeModal}
                >
                    <Icons.Cross className="w-5 h-5" />
                </Button>
            </div>
            <div className="w-[95%] pb-2 border-b border-gray-200"></div>

            <Form onSubmit={handleSubmit} className=" py-2 w-full">
                <label className=" text-sm self-start" htmlFor="fname">First Name</label>
                <Input id='fname' type='text' className=' placeholder:text-sm placeholder:text-gray-400' />
                {formError.firstName && <ErrorMessage>{formError.firstName}</ErrorMessage>}
                <label className=" text-sm self-start" htmlFor="lname">Last Name</label>
                <Input id='lname' type='text' className=' placeholder:text-sm placeholder:text-gray-400' />
                {formError.lastName && <ErrorMessage>{formError.lastName}</ErrorMessage>}

                <Button intent={'action'} type='submit' disabled={isLoading} className='py-1 mt-2' size={'medium'}>Change Name</Button>
            </Form>
        </motion.div>
    )
});

const ChangePassword = memo(({ closeModal }: CommonProps) => {
    const [formError, setFormError] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [changePassword] = useChangePasswordMutation()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setFormError({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
        const currentPassword = e.target[0].value
        const newPassword = e.target[2].value
        const confirmPassword = e.target[4].value

        console.log(currentPassword, newPassword, confirmPassword)

        if (!currentPassword) {
            setFormError((prev) => ({ ...prev, currentPassword: 'Current password is required' }))
            return
        }
        if (!newPassword) {
            setFormError((prev) => ({ ...prev, newPassword: 'New password is required' }))
            return
        }
        if (newPassword !== confirmPassword) {
            setFormError((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }))
            return
        }
        if (newPassword.length < 6) {
            setFormError((prev) => ({ ...prev, newPassword: 'Password must be at least 6 characters' }))
            return
        }
        if (currentPassword === newPassword) {
            setFormError((prev) => ({ ...prev, newPassword: 'New password must be different from current password' }))
            return
        }

        try {

            const res = await changePassword({ oldPassword: currentPassword, newPassword }).unwrap()
            console.log(res)
            showToast(
                res.message ?? 'Password changed successfully',
                'success'
            )
            closeModal()

        } catch (e: any) {
            console.log(e)
            showToast(
                e.data.message,
                'error'
            )
        }

    }
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

            <Form onSubmit={handleSubmit} className=" py-2 w-full">
                <label className=" text-sm self-start" htmlFor="current-password">Current Password</label>
                <InputPassword id='current-password' className=' placeholder:text-sm placeholder:text-gray-400' />
                {formError.currentPassword && <ErrorMessage>{formError.currentPassword}</ErrorMessage>}
                <label className="text-sm self-start" htmlFor="new-password">New Password</label>
                <InputPassword id='new-password' className=' placeholder:text-sm placeholder:text-gray-400' />
                {formError.newPassword && <ErrorMessage>{formError.newPassword}</ErrorMessage>}
                <label className="text-sm self-start" htmlFor="confirm-new-password">Confirm Password</label>
                <InputPassword id='confirm-new-password' className=' placeholder:text-sm placeholder:text-gray-400' />
                {formError.confirmPassword && <ErrorMessage>{formError.confirmPassword}</ErrorMessage>}
                <Button intent={'action'} type='submit' className='py-1 mt-2' size={'medium'}>Change Password</Button>
            </Form>
        </motion.div>
    )
});

const SetPassword = memo(({ closeModal }: CommonProps) => {
    const [formError, setFormError] = useState({
        password: '',
        confirmPassword: ''
    })

    const [setPassword] = useSetPasswordMutation()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setFormError({
            password: '',
            confirmPassword: ''
        })
        const password = e.target[0].value
        const confirmPassword = e.target[2].value

        console.log(password, confirmPassword)

        if (!password) {
            setFormError((prev) => ({ ...prev, password: 'New password is required' }))
            return
        }
        if (password !== confirmPassword) {
            setFormError((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }))
            return
        }
        if (password.length < 6) {
            setFormError((prev) => ({ ...prev, password: 'Password must be at least 6 characters' }))
            return
        }

        try {

            const res = await setPassword({ password }).unwrap()
            console.log(res)
            showToast(
                res.message ?? 'Password Set successfully',
                'success'
            )
            closeModal()

        } catch (e: any) {
            console.log(e)
            showToast(
                e.data.message,
                'error'
            )
        }

    }
    return (
        <motion.div
            className=" bg-white p-4 rounded-md shadow border w-full max-w-96"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
        >
            <div className='flex justify-between items-center'>
                <h3 className="font-medium">Set Password</h3>
                <Button
                    onClick={closeModal}
                >
                    <Icons.Cross className="w-5 h-5" />
                </Button>
            </div>
            <div className="w-[95%] pb-2 border-b border-gray-200"></div>

            <Form onSubmit={handleSubmit} className=" py-2 w-full">
                <label className="text-sm self-start" htmlFor="password">Password</label>
                <InputPassword id='password' className=' placeholder:text-sm placeholder:text-gray-400' />
                {formError.password && <ErrorMessage>{formError.password}</ErrorMessage>}
                <label className="text-sm self-start" htmlFor="confirm-new-password">Confirm Password</label>
                <InputPassword id='confirm-new-password' className=' placeholder:text-sm placeholder:text-gray-400' />
                {formError.confirmPassword && <ErrorMessage>{formError.confirmPassword}</ErrorMessage>}
                <Button intent={'action'} type='submit' className='py-1 mt-2' size={'medium'}>Set Password</Button>
            </Form>
        </motion.div>
    )
});

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
                <Button intent={'action'} className='py-1 mt-2' size={'medium'}>Change Email</Button>
            </Form>
        </motion.div>
    )
}

const DeleteAccount = ({ closeModal }: CommonProps) => {
    return (
        <motion.div
            className=" bg-white p-4 rounded-md shadow border w-full max-w-96"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
        >
            <div className='flex justify-between items-center'>
                <h3 className="font-medium text-red-600 ">Delete Account</h3>
                <Button
                    onClick={closeModal}
                >
                    <Icons.Cross className="w-5 h-5" />
                </Button>
            </div>
            <div className="w-[95%] pb-2 border-b border-gray-200"></div>
            <div className='flex justify-center items-center pt-2'>
                <Icons.Exclamation className="w-12 h-12" />
            </div>
            <p className="text-sm text-red-500 font-semibold py-2 text-center">Are you sure you want to delete your account? All your files and data will be permanently deleted. This action cannot be undone.</p>

            <Form onSubmit={() => { }} className=" py-2 w-full">
                <label className=" text-sm self-start" htmlFor="password">Account Password</label>
                <InputPassword id='password' className=' placeholder:text-sm placeholder:text-gray-400' />
                <Button intent={'action'} className='py-1 mt-2 bg-red-500' size={'medium'}>Proceed with Account Deletion</Button>
                <Button onClick={closeModal} intent={'action'} className='py-1 mt-' size={'medium'}>Cancel</Button>
            </Form>
        </motion.div>
    )
}


const Account = () => {
    const [openModal, setOpenModal] = useState<string | null>(null)

    const userAuthMethod = useAppSelector((state) => state.auth.user?.authMethod)

    const closeModal = () => {
        setOpenModal(null)
    }

    const options = [
        {
            id: '00',
            name: 'Change Name',
            Component: ChangeName
        },
        userAuthMethod === "credentials" ?
            {
                id: '01',
                name: 'Change Password',
                Component: ChangePassword
            } :
            {
                id: '01',
                name: 'Set Password',
                Component: SetPassword
            },
        // {
        //     id: '02',
        //     name: 'Change Email',
        //     Component: ChangeEmail
        // },
        // {
        //     id: '02',
        //     name: 'Delete Account',
        //     Component: DeleteAccount
        // }
    ]

    const Component = options.find(option => option.id === openModal)?.Component as typeof ChangeName | typeof ChangePassword | typeof ChangeEmail | typeof DeleteAccount

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
                        {options.map(({ id, name }, index) => {
                            if (id === '03') {
                                return (
                                    <Button className="flex gap-3 bg-red-500  w-full max-w-96 shadow backdrop-blur px-3 py-3 rounded-md"
                                        key={id}
                                        intent={'action'}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
                                        exit={{ opacity: 0, y: 10 }}
                                        onClick={() => setOpenModal(id)}
                                    >
                                        <div className=" w-full text-sm text-white flex items-center justify-between">
                                            <div>{name}</div>
                                            <Icons.Right_Arrow_White className="w-5 h-5 scale-50" />
                                        </div>
                                    </Button>
                                )
                            }

                            return (
                                <Button className="flex gap-3 bg-white w-full max-w-96 shadow backdrop-blur px-3 py-3 rounded-md"
                                    key={id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
                                    exit={{ opacity: 0, y: 10 }}
                                    onClick={() => setOpenModal(id)}
                                >
                                    <div className=" w-full text-sm flex items-center justify-between">
                                        <div>{name}</div>
                                        <Icons.Right_Arrow className="w-5 h-5" />
                                    </div>
                                </Button>
                            )
                        })}
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
                        {/* {options.find(option => option.id === openModal)?.Component({ closeModal })} */}
                        <Component closeModal={closeModal} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Account