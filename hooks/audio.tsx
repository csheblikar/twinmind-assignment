import {
  getRecordingPermissionsAsync,
  PermissionResponse,
  requestRecordingPermissionsAsync,
} from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useRecordingPermissions({ get = true, request = false } = {}) {
  const isMounted = useRef(true);
  const [status, setStatus] = useState<PermissionResponse | null>(null);

  const getPermission = useCallback(async () => {
    const response = await getRecordingPermissionsAsync();
    if (isMounted.current) {
      setStatus(response);
    }
    return response;
  }, []);

  const requestPermission = useCallback(async () => {
    const response = await requestRecordingPermissionsAsync();
    if (isMounted.current) {
      setStatus(response);
    }
    return response;
  }, []);

  useEffect(() => {
    if (request) {
      requestPermission();
    } else if (get) {
      getPermission();
    }
  }, [get, getPermission, request, requestPermission]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return [status, requestPermission, getPermission] as const;
}
