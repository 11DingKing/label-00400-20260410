/**
 * 表单校验规则
 */

// 手机号校验
export const phoneValidator = (_, value) => {
  if (!value) return Promise.resolve();
  const reg = /^1[3-9]\d{9}$/;
  if (reg.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('请输入正确的手机号'));
};

// 身份证号校验
export const idCardValidator = (_, value) => {
  if (!value) return Promise.resolve();
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (reg.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('请输入正确的身份证号'));
};

// 必填校验
export const requiredRule = (message) => ({
  required: true,
  message: message || '此项为必填项',
});
