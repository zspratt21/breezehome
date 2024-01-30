import {useForm, usePage} from "@inertiajs/react";
import {PageProps} from "@/types";
import {FormEventHandler, useState} from "react";
import axios from "axios";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import NumberInput from "@/Components/NumberInput";
import DangerButton from "@/Components/DangerButton";
import RecoveryCodes from "@/Pages/Auth/RecoveryCodes";

export default function ConfigureTwoFactorForm({ className = '' }: { className?: string }) {
    const user = usePage<PageProps>().props.auth.user;
    const [clickedEnable , setClickedEnable] = useState(false);
    const [clickedDisable , setClickedDisable] = useState(false);
    const [mfaEnabled , setMfaEnabled] = useState(user.two_factor_enabled);
    const { data, setData, post, errors, setError, clearErrors, processing, recentlySuccessful } = useForm({
        code: '',
    });
    const [qrCode, setQrCode] = useState('');
    const [recoveryCodes, setRecoveryCodes] = useState(null as string[] | null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        clearErrors();
        if (clickedDisable) {
            axios.post(route('2fa.disable'), data).then((response) => {
                console.log(response);
                if (response.data.disabled_2fa == 1) {
                    setMfaEnabled(0);
                    setClickedDisable(false);
                    setData('code', '');
                }
                else {
                    setError('code', 'Invalid code');
                }
            }).catch((error) => {
                console.log(error);
            });
        }
        else if (!clickedEnable) {
            setClickedEnable(true);
            axios.post(route('2fa.enable')).then((response) => {
                console.log(response);
                setQrCode(response.data.qr_png);
            }).catch((error) => {
                console.log(error);
            });
        }
        else {
            axios.post(route('2fa.enable.check'), data).then((response) => {
                console.log(response);
                if(response.data.valid == 1) {
                    setMfaEnabled(1);
                    setClickedEnable(false);
                    setQrCode('');
                    setRecoveryCodes(response.data.recovery_codes);
                    setData('code', '');
                }
                else {
                    setError('code', 'Invalid code');
                }
            }).catch((error) => {
                console.log(error);
            });

        }

    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Two Factor Authentication</h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {mfaEnabled ? (
                        <>You have enabled two factor authentication &#xf058;</>
                    ) : (
                        <>Configure two factor authentication to increase the security of your account.</>
                        )}
                </p>
            </header>
            <form onSubmit={submit}>
                {!mfaEnabled || clickedDisable ? (
                    <div>
                        {!clickedEnable && !clickedDisable ? (
                            <div className="mt-4">
                                <PrimaryButton type="submit">
                                    &#xf205; Enable
                                </PrimaryButton>
                            </div>
                        ) : (
                            <div>
                                {!mfaEnabled && (
                                    <div className="mt-4">
                                        {qrCode == '' ? (
                                            <div>
                                                loading qr code...
                                            </div>
                                        ) : (
                                            <img src={qrCode} alt="2FA QR Code"></img>
                                        )}
                                    </div>
                                )}
                                <div className="mt-4">
                                    <InputLabel htmlFor="code"
                                                value={!mfaEnabled ? 'Scan the above Qr Code with google authenticator then...' : 'To confirm you want to disable 2FA on your account you need to...'}/>

                                    <NumberInput
                                        id="code"
                                        className="mt-1 block w-full"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        placeholder="&#xe2c5; Enter the code from your authenticator app"
                                        required
                                        autoComplete="off"
                                        maxLength={6}
                                        minLength={6}
                                    />

                                    <InputError className="mt-2" message={errors.code}/>
                                </div>
                                <div className="mt-4">
                                    {!mfaEnabled ? (
                                        <PrimaryButton type="submit">
                                            &#xe2c5; Activate 2FA
                                        </PrimaryButton>
                                    ) : (
                                        <DangerButton type="submit">
                                            &#xf071; Confirm
                                        </DangerButton>
                                        )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {recoveryCodes && (
                            <RecoveryCodes recoveryCodes={recoveryCodes}/>
                        )}
                        <div className="mt-4">
                            <DangerButton onClick={(e) => {e.preventDefault(); setClickedDisable(true)}}>
                                &#xf057; Disable
                            </DangerButton>
                        </div>
                    </>
                )}
            </form>
        </section>
    );
}
