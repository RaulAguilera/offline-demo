using Microsoft.AspNetCore.Mvc;
using OfflineDemo.Models;
using System.Diagnostics;

namespace OfflineDemo.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetInspections()
        {
            List<ScheduledInspection> inspections = new()
            {
                new ScheduledInspection { InspectionId = 1, CustomerName = "Raul", CleanDate = DateTime.Now, InspectorName = "The inspector" },
                new ScheduledInspection { InspectionId = 2, CustomerName = "Raul 2", CleanDate = DateTime.Now, InspectorName = "The inspector 2" },
                new ScheduledInspection { InspectionId = 3, CustomerName = "Raul 3", CleanDate = DateTime.Now, InspectorName = "The inspector 3", EndDate = DateTime.Now }
            };

            return Json(inspections);
        }

        [HttpPost]
        public IActionResult CompleteInspection(ScheduledInspection inspection)
        {
            return Ok();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }

    public class ScheduledInspection
    {
        public int InspectionId { get; set; }

        public string CustomerName { get; set; }

        public DateTime CleanDate { get; set; }

        public string InspectorName { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
