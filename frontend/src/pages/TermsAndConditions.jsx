import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-[#fcf9f2] pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-10 md:p-16 shadow-xl border border-gray-50">
                <h1 className="text-4xl font-black text-[#1e1964] uppercase tracking-tighter mb-8 text-center">Terms and Conditions</h1>

                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-[#1e1964] uppercase tracking-widest mb-4">1. Booking and Cancellation</h2>
                        <p>
                            Reservations are subject to availability. A 30% non-refundable deposit is required at the time of booking for certain experience types. Full payment is required for homestay and other standard bookings unless otherwise specified.
                        </p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Cancellations made 15 days prior to arrival are eligible for a 50% refund (excluding deposit).</li>
                            <li>No refunds will be issued for cancellations made within 7 days of the scheduled arrival.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1e1964] uppercase tracking-widest mb-4">2. Experience Participation</h2>
                        <p>
                            Activities such as trekking and shepherd life experiences involve physical exertion and exposure to high-altitude environments. Participants must ensure they are in good health and have adequate travel insurance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1e1964] uppercase tracking-widest mb-4">3. Respecting Local Culture</h2>
                        <p>
                            Kharnak is a sacred and culturally rich region. Guests are expected to respect local traditions, wildlife, and the environment. Littering or any form of environmental degradation is strictly prohibited.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1e1964] uppercase tracking-widest mb-4">4. Liability</h2>
                        <p>
                            Experience Kharnak and its associates are not responsible for any loss, injury, or damage to person or property during the stay or activity.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1e1964] uppercase tracking-widest mb-4">5. Privacy Policy</h2>
                        <p>
                            Your personal information will be used solely for booking purposes and will not be shared with third parties without your consent.
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

export default TermsAndConditions;
