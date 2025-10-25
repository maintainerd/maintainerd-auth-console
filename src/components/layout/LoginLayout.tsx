import MaintainedAuthIcon from "../icon/MaintainedAuthIcon"

type Props = {
  children: React.ReactNode
}

const LoginLayout = ({ children }: Props) => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <MaintainedAuthIcon width={24} height={24} className="shrink-0" />
          <span className="drop-shadow-sm">M9d-Auth</span>
        </a>
        {children}
      </div>
    </div>
  )
}

export default LoginLayout;
