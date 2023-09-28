const isServer = typeof window === 'undefined';

let useRouter;
if (!isServer) {
  useRouter = require('next/router').useRouter;
}

export default useRouter;