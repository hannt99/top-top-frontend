import { useState } from 'react';
import InputField from '~/components/InputField';
import { passwordValidator } from '~/utils/formValidation';
import Loading from '~/components/Loading';
import * as authServices from '~/services/authServices';
import { successNotify, errorNotify } from '~/components/ToastMessage';

const ResetPassword = () => {
    // Input state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Input validation state
    const [isNewPasswordErr, setIsNewPasswordErr] = useState(false);
    const [newPasswordErrMsg, setNewPasswordErrMsg] = useState({});

    const [isConfirmPasswordErr, setIsConfirmPasswordErr] = useState(false);
    const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] = useState({});

    const [loading, setLoading] = useState(false);

    // Reset password function
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isPasswordValid = passwordValidator(newPassword, newPassword, setIsNewPasswordErr, setNewPasswordErrMsg);
        const isConfirmPasswordValid = passwordValidator(
            confirmPassword,
            newPassword,
            setIsConfirmPasswordErr,
            setConfirmPasswordErrMsg,
        );
        if (!isPasswordValid || !isConfirmPasswordValid) return;

        setLoading(true);

        const data = {
            token: localStorage.getItem('resetPasswordToken'),
            password: newPassword,
        };
        const res = await authServices.resetPassword(data);
        if (res.code === 200) {
            localStorage.removeItem('resetPasswordToken');
            setLoading(false);
            successNotify(res.message);
        } else {
            setLoading(false);
            errorNotify(res);
        }
    };

    return (
        <>
            <div className="flex items-center justify-center w-screen h-screen bg-[#ebedef]">
                <div className="w-[330px] md:w-[450px] h-fit bg-white p-[36px] rounded-md shadow-4Way">
                    <h1 className="text-[#9fa9ae] text-center italic text-[4.6rem] font-semibold">
                        QLVB <span className="text-[2.4rem]">v1.0</span>
                    </h1>
                    <h1 className="text-[#9fa9ae] text-center text-[2.0rem] font-medium mb-16">Đặt lại mật khẩu</h1>
                    <form>
                        <InputField
                            placeholder="Mật khẩu mới"
                            name="password"
                            value={newPassword}
                            setValue={setNewPassword}
                            onBlur={() => passwordValidator(newPassword, newPassword, setIsNewPasswordErr, setNewPasswordErrMsg)}
                            className={isNewPasswordErr ? 'invalid' : 'default'}
                        />
                        <p className="text-red-600 text-[1.3rem]">{newPasswordErrMsg.newPassword}</p>
                        <div className="mt-7">
                            <InputField
                                placeholder="Xác nhận mật khẩu"
                                name="password"
                                value={confirmPassword}
                                setValue={setConfirmPassword}
                                onBlur={() =>
                                    passwordValidator(
                                        confirmPassword,
                                        newPassword,
                                        setIsConfirmPasswordErr,
                                        setConfirmPasswordErrMsg,
                                    )
                                }
                                className={isConfirmPasswordErr ? 'invalid' : 'default'}
                            />
                            <p className="text-red-600 text-[1.3rem]">{confirmPasswordErrMsg.confirmPassword}</p>
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="w-full text-[white] bg-[#321fdb] mt-12 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                        >
                            Đặt lại
                        </button>
                    </form>
                </div>
            </div>
            {loading && (
                <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-[#000000]/[.15] z-[999]">
                    <Loading />
                </div>
            )}
        </>
    );
};

export default ResetPassword;
