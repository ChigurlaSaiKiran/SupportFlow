using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.Interfaces
{
   
        public interface IUnitOfWork
        {
            Task<int> SaveChangesAsync();    
        IGenericRepository<T> Repository<T>() where T : class;
    }
    
}
