//封装nuqs的useQueryState
import { parseAsString, useQueryState } from "nuqs";

export const useSearchParams = (key:string) => {
  return useQueryState(
    key, 
    parseAsString  // 1. 类型约束（强制字符串类型）
      .withDefault("")  // 2. 默认值
      .withOptions({
        clearOnDefault:true  // 3. 自动清理机制
      })
  );
};