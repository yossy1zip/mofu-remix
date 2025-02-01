import DefaultLayout from "~/components/layouts/DefaultLayout";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <DefaultLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            404 not found.
          </h1>
          <p className="text-gray-600 text-lg">
            ページが見つかりませんでした。
          </p>
          <p className="text-gray-600 text-lg mt-2">
            URLに間違いがないかご確認ください( ˘ω˘ )
          </p>
          <p className="text-gray-600 text-lg mt-2">
            <Link to="/">トップへ戻る</Link>
          </p>
        </div>
      </div>
    </DefaultLayout>
  );
}