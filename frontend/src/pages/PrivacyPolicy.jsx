import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#fcf9f2] pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-10 md:p-16 shadow-xl border border-gray-50">
                <h1 className="text-4xl font-black text-[#1e1964] uppercase tracking-tighter mb-8 text-center">Privacy Policy</h1>

                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-[#1e1964] uppercase tracking-widest mb-4">1. Information We Collect</h2>
                        <p>
                            We collect information that you provide directly to us when you book a stay, create an account, or subscribe to our newsletter. This may include your name, email address, phone number, and booking details.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1e1964] uppercase tracking-widest mb-4">2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Process and confirm your bookings.</li>
                            <li>Send you updates about your stay or orders.</li>
                            <li>Send newsletter communications if you have opted in.</li>
                            <li>Improve our services and community initiatives.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1e1964] uppercase tracking-widest mb-4">3. Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational measures to protect your personal data against unauthorized processing and against accidental loss, destruction, or damage.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1e1964] uppercase tracking-widest mb-4">4. Sharing of Information</h2>
                        <p>
                            We do not sell or rent your personal information to third parties. We may share information with service providers (such as payment processors like Razorpay) only as necessary to fulfill your requests.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1e1964] uppercase tracking-widest mb-4">5. Your Rights</h2>
                        <p>
                            You have the right to access, update, or delete your personal information. If you wish to exercise these rights, please contact us at kharnakchangthang@gmail.com.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        Last Updated: December 2025
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
