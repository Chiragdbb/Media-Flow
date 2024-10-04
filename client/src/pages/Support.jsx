const Support = () => {
    document.title = "Support - Nexus Point";
    return (
        <div className="mx-auto w-[65%] px-10 py-6 text-white leading-[25px]">
            <h1 className="text-5xl font-bold text-center">Support</h1>
            <section className="mt-14">
                <h2 className="font-bold text-xl">
                    Welcome to the Support Center!
                </h2>
                <p className="mt-4">
                    We’re here to assist you with any issues or questions you
                    might have. Below, you’ll find answers to common questions
                    and information on how to contact us for further help.
                </p>
            </section>
            <div className="h-[1px] bg-white/10 mt-6 mb-5"></div>
            <section>
                <h4 className="font-bold text-xl">
                    Frequently Asked Questions (FAQs):
                </h4>
                <ol className="list-decimal pl-6 *:pl-2 mt-6 *:mt-5 font-bold *:text-lg">
                    <li>
                        How do I upload a video?
                        <p className="mt-1 font-normal text-base">
                            To upload a video, click the "Upload" button located
                            in the top-right corner of the account settings.
                            From there, follow the steps to select your video
                            file and ensure it meets our upload guidelines.
                        </p>
                    </li>
                    <li>
                        What video formats are accepted?
                        <p className="mt-1 font-normal text-base">
                            We support MP4, MOV, AVI, and WMV formats. The
                            maximum file size for uploads is 2GB, so make sure
                            your file fits within these limits.
                        </p>
                    </li>
                    <li>
                        How can I reset my password?
                        <p className="mt-1 font-normal text-base">
                            If you’ve forgotten your password or are unable to
                            log in, click the "Forgot Password" link on the
                            login page. Follow the instructions in the email to
                            reset your password.
                        </p>
                    </li>
                    <li>
                        Can I edit or delete my uploaded videos?
                        <p className="mt-1 font-normal text-base">
                            Yes, you can edit the title, and description of any
                            video you've uploaded by going to your profile
                            manager. If you wish to delete a video, click on the
                            video options and select "Delete."
                        </p>
                    </li>
                    <li>
                        How do I change my profile picture?
                        <p className="mt-1 font-normal text-base">
                            To update your profile picture, go to your account
                            settings, click on "Edit Profile picture," and
                            upload a new image. Your changes will be saved
                            automatically.
                        </p>
                    </li>
                    <li>
                        Why is my video stuck processing?
                        <p className="mt-1 font-normal text-base">
                            Video processing time depends on the size and format
                            of the file. If your video has been stuck processing
                            for more than an hour, try re-uploading it or
                            contact support for assistance.
                        </p>
                    </li>
                    <li>
                        Is there a limit on the number of videos I can upload?
                        <p className="mt-1 font-normal text-base">
                            User have a limit of 15 videos per month,
                            while premium accounts have unlimited uploads. Premium membership is given out to selected members only.
                        </p>
                    </li>
                </ol>
            </section>
            <div className="h-[1px] bg-white/10 mt-6 mb-5"></div>
            <section className="">
                <h3 className="font-bold text-xl">Contact Us:</h3>
                <p className="mt-4">
                    Still need help? Feel free to reach out to our support team
                    at{" "}
                    <span className="text-purple-400 hover:underline cursor-pointer">support@nexus-point.com</span>{" "}
                    for any further questions or technical issues. Our team is
                    available 24/7 and will respond within 24 hours.
                </p>
                <p className="mt-6">Thank you for being part of our community!</p>
            </section>
        </div>
    );
};

export default Support;
