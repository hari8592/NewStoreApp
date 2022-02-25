using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Interfaces;
using Core.Entities;
using StackExchange.Redis;
using System.Text.Json;

namespace Infrastructure.Data
{
    public class BasketRepository : IBasketRepository
    {
        private readonly IDatabase _database;
        public BasketRepository(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
        }
        public async Task<CustomerBasket> GetBasketAsync(string basketId)
        {
            var data = await _database.StringGetAsync(basketId);

            //deserailize => using System.Text.Json;
            //Serialization is the process of converting an object into a stream of
            //bytes to store the object or transmit it to memory,
            //a database, or a file. Its main purpose is to save the state of an object in order
            //to be able to recreate it when needed.
            //The reverse process is called deserialization.
            return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<CustomerBasket>(data);
        }
        public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
        {
            //create and udpate
            //will set upto 30 days
            var created = await _database.StringSetAsync(basket.Id, JsonSerializer.Serialize(basket), 
                                TimeSpan.FromDays(30));
            //create
            if (!created) return null;
            //update 
            return await GetBasketAsync(basket.Id);
        }
        public async Task<bool> DeleteBasketAsync(string basketId)
        {
            return await _database.KeyDeleteAsync(basketId);
        }

       

       
    }
}
