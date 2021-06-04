namespace Medico.Application.ViewModels
{
    public class OperationResult<T> where T : class
    {
        public OperationResult(T result, string error)
        {
            Result = result;
            Error = error;
        }

        public T Result { get; }

        public string Error { get; }

        public bool Success => string.IsNullOrEmpty(Error);

        public static OperationResult<T> CreateSuccessResult(T result)
        {
            return new OperationResult<T>(result, null);
        }

        public static OperationResult<T> CreateErrorResult(string error)
        {
            return new OperationResult<T>(null, error);
        }
    }
}
