import { appInfo, assets, footerContents } from "@/app/config";

const Footer = () => {
    return (
        <section className="relative bottom-0 left-0 py-10 md:py-32 w-full border-t bg-white z-[101]">
            <div className="container mx-auto px-10">
                <footer>
                    <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
                        <div className="col-span-2 mb-8 lg:mb-0">
                            <a
                                href="/"
                                className="block"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <img
                                        src={assets.logoUrl}
                                        className="w-12"
                                        alt="logo"
                                    />
                                    <span className="text-xl font-bold">{appInfo.appName}</span>
                                </div>
                            </a>
                            <p className="font-regular text-muted-foreground">{appInfo.tagLine}</p>
                        </div>

                        {footerContents.sections.map((section, sectionIdx) => (
                            <div className="hidden lg:block" key={sectionIdx}>
                                <h3 className="mb-4 font-bold">{section.title}</h3>
                                <ul className="space-y-4 text-muted-foreground">
                                    {section.links.map((link, linkIdx) => (
                                        <li
                                            key={linkIdx}
                                            className="font-medium hover:text-primary"
                                        >
                                            <a href={link.href}>{link.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="lg:mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
                        <p>© 2024 {appInfo.appName}. All rights reserved.</p>
                        <ul className="flex gap-4">
                            {footerContents.bottomContent.map((content, id) => (
                                <li key={id} className="underline hover:text-primary">
                                    <a href={content.href}>{content.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export default Footer;
